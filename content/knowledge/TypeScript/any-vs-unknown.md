---
title: "Any V.S. Unknown"
date: "2026-05-12"
tags: ["Type"]
---


<AnyTrapDemo />


# `any`

> Everything is legal. I check nothing.


```ts
let value: any = "hello"

value.toUpperCase()
value()
value.notExist.deep.call()
```

---

Essence: "Turn off the type system" ("Revert to JavaScript here").

---

# `unknown`

> I don't know the type, so you must check it first; otherwise, you cannot proceed to the next step.


```ts
let value: unknown = "hello"

value.toUpperCase() // ❌
```

## Check: Narrowing

```ts
let value: unknown = "hello"

if (typeof value === "string") {
  value.toUpperCase() // ✅
}
```

---

Why does `unknown` force you to perform Narrowing?

Because:

`unknown` essentially represents "The union of all types": `string | number | boolean | object | ...`


So, TS reasons:

> Since it could be anything, you cannot perform arbitrary operations on it. It is dangerous.

---

Back to our example above, when we work with unknown, we should: 


```ts
const data: unknown = await response.json()

if (
  // typeof data === "object" && data !== null && "user" in data && ...
) {
  console.log(data.user.name)
}
```


---


# Quiz: Pass or Fail?


```ts
let value: unknown

value = 123
value = "hello"
value = true
```

<details>
<summary>Answer</summary>

P
</details>

---


```ts
let value: unknown = "hello"

let str: string = value
```

<details>
<summary>Answer</summary>

F
</details>

---


```ts
let value: any = "hello"

let str: string = value
```

<details>
<summary>Answer</summary>

P
</details>

---

## Type Pollution with `any`


```ts
function getData(): any {
  return {
    name: "Tom",
    age: 18
  }
}

const data = getData()

data.address.city
```

<details>
<summary>Answer</summary>

Fail.

`any` tells TypeScript: “Stop inferring—I know better than you do.”

Consequently, TypeScript completely gives up on checking:

```ts
data.name     // OK
data.age      // OK
data.xxx      // OK
```

Here without `any` TS automatically infers:

```ts
function getData(): any {
  return {
    name: "Tom",
    age: 18
  }
}

const data = getData()

data.name     // OK
data.age      // OK
data.xxx      // ❌
```

</details>


---

# When is `any` permissible?

>1. The types provided by a third-party library are extremely poor.
>2. Migrating a legacy JavaScript project.
>3. Temporary debugging.
>4. You explicitly know that you are bypassing type checks.
    
