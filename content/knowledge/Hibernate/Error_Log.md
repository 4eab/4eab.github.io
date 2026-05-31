---
title: "Error Log"
date: "2026-05-31"
---

Gemini wrote the following incorrect deletion method:
- What this actually does is delete all `UserTag` that:
  - belong to the given `userTagGroup`;
  - *and* are associated with the given `userAlbum` (i.e., whose `userAlbums` collection contains the specified `UserAlbum`).

```Java
@Modifying  
@Query("
	DELETE FROM UserTag ut 
	WHERE ut.userTagGroup 
	IN :groups 
	AND :album MEMBER OF ut.userAlbums")  
void removeAlbumFromTags(@Param("groups") List<UserTagGroup> groups, @Param("album") UserAlbum album);
```
My initial intention was to delete all associations between a `UserTag` and a given `UserAlbum` in the `user_album_tag` table, provided that the `UserTag` belongs to a specific `UserTagGroup`.

```Java
@Modifying  
@Query(value = "DELETE FROM user_album_tag " +  
        "WHERE user_album_id = :albumId " +  
        "AND user_tag_id IN (SELECT t.id FROM user_tag t WHERE t.user_tag_group_id IN :groupIds)",  
        nativeQuery = true)  
void removeAllAlbumTagsFromGroups(@Param("albumId") Long albumId,  
                                  @Param("groupIds") List<Long> groupIds);
```

However, in reality, the execution results of Gemini's method were entirely as expected; I only discovered the error when I examined the actual SQL statements that were executed.

---

Hibernate translated Gemini's DELETE into two statements:

```sql
delete from user_album_tag to_delete_
where to_delete_.user_tag_id in (
    select ut1_0.id
    from user_tag ut1_0
    where ut1_0.user_tag_group_id in (?)
    and exists (
        select 1
        from user_album_tag ua1_0
        where ut1_0.id = ua1_0.user_tag_id
        and ua1_0.user_album_id = ?
    )
)
```

Delete the relationship records from `user_album_tag` where:
- The tag belongs to a specified group;
- *and* that tag is associated with a specified album.

The `exists` clause checks for the presence of a record.
- `select 1` acts as a placeholder: "If this row exists, simply return a 1."
- This is the most lightweight approach, as it requires fetching no actual data.
- It verifies that an association exists between the `UserTag` and the specified `UserAlbum`.


```sql
delete from user_tag ut1_0 
where ut1_0.user_tag_group_id in (?) 
and exists(
	select 1 
	from user_album_tag ua1_0 
	where ut1_0.id=ua1_0.user_tag_id 
	and ua1_0.user_album_id=?
)
```

Delete all tags from the `user_tag` table that:
- Belong to a specified group;
- *and* are associated with a specified album
  - (i.e., a corresponding relationship record exists in the `user_album_tag` table linking the tag and the `userAlbum`).

Therefore: 

After Hibernate removes the matching rows from the join table,
the subsequent DELETE on `user_tag` no longer finds any rows satisfying the `EXISTS` condition.
As a result, no `UserTag` entities are actually deleted.

---

Why are two separate statements required?
The database system prohibits leaving behind "dangling foreign keys."

```Java
@ManyToMany
@JoinTable(
    name = "user_album_tag",
    joinColumns = @JoinColumn(name = "user_tag_id"),
    inverseJoinColumns = @JoinColumn(name = "user_album_id")
)
private Set<UserAlbum> userAlbums;

```

Hibernate recognizes that `UserTag` participates in a `ManyToMany` relationship, so it attempts to maintain referential integrity.

Gemini's query produced the desired result only because Hibernate first removed the matching rows from the join table before executing the entity deletion.

The behavior only became obvious after examining Hibernate's generated SQL. Lesson learned: always inspect the generated SQL.
