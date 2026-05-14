---
title: "Types General"
date: "2026-05-12"
tags: ["Type", "Basis"]
---


TypeScript ≠ a new language

- TypeScript: JavaScript With a Type System
  - TS will be complied into JS
    - e.g. `const a: number = 1` to `const a = 1`
    - Type Info will be erased!

---


# Types & Type Annotations



Type: A set / collection of values.

---

```ts
let age: number = 18
```

`: number`: annotation
- explicitly inform TypeScript what type a variable belongs to.

---

```js
let age = 18
age = "hello" // JS: ✅
```


```ts
let age: number = 18
age = "hello" // TS: ❌
```

Goal & Value of TS: catch errors before runtime!


## Type Annotations With Objects


```ts
const user: {
  name: string
  age: number
} = {
  name: "Tom",
  age: 18
}
```

```ts
type User = {
  name: string
  age: number
}

const tom = {
  name: "Tom",
  age: 18
}

const user: User = tom
```

---

### Type Alias


```ts
type User = {
  name: string
  age: number
}

const user: User = ...
```

## Type Annotations With Function


```ts
function greet(name: string) {
  return "Hello " + name
}
```


```ts
function add(a: number, b: number): number {
  return a + b
}
```


### Optional Parameters

```ts
function greet(name?: string) { // name: string | undefined
  console.log(name)
}
```

### Default Parameters

```ts
function greet(name: string = "Guest") {
  console.log(name)
}
```

### Function Rest Parameter

```ts
function sum(...nums: number[]) {
}
```

#TODO: Handling Rest Parameters of Uncertain Types

# Dynamic Type Determination


```ts
let age = 18
```

TS：AHA! `age: number`


# Any Type


```ts
let value: any = 123

value = "hello"
value = true
value()
```

Neither will throw an error. [Details](/knowledge/typescript/any-vs-unknown)



# Void & Never

`void`: no return value

```ts
function logMessage(msg: string): void {
  console.log(msg)
}
```

---

`never`: never return (impossible)


```ts
// e.g. Error
function throwError(): never {
  throw new Error()
}

// e.g. Dead Loop
function loop(): never {
  while (true) {}
}
```

# Union Types

Syntax: `A | B`

```ts
let value: string | number

value = "hello"
value = 123
```

Semantic: `string` or `number`, both are possible.

But remember:

```ts
function print(value: string | number) {
  value.toUpperCase() // ❌ You can only use "Shared Abilities."
}
```


# Literal Types

```ts
let status: string
```

`status` can be arbitrary string.

---

```ts
let status: "success"
```

`status` can only be `"success"`.


---

Usage: together with Union Types

```ts
type Status =
  | "loading"
  | "success"
  | "error"
```

---

# Nullable Types


`null`, `undefined` require clear handling.


```ts
let username: string | null = null
```


# Intersection Type

`&`: Satisfies multiple types simultaneously.


```ts
type Person = {
  name: string
}

type Employee = {
  salary: number
}

type Staff = Person & Employee
```

Equivalent to:

```ts
{
  name: string
  salary: number
}
```

# Type Annotations With Arrays


```ts
let nums: number[] = [1, 2, 3]



let nums: Array<number> = [1, 2, 3]
```

## Multidimensional Arrays

```ts
let matrix: number[][] = [
  [1, 2],
  [3, 4]
]

let cube: number[][][] = []
```


# Tuple


`(string | number)[]`
- Indeterminate length
- Indeterminate order


```ts
let user: [string, number]

user = ["Tom", 18]
```

- the first must be `string`
    
- the second must be `number`
    

`const [state, setState] = useState()` in React is tupel.



# Summary

The essence of TS is not "adding types to JS," but rather: "using types to describe data structures."


TS is a form of "modeling capability."

What you are doing is:

- Describing data

- Describing state

- Describing constraints

- Describing possibilities
    
