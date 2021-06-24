//@ts-check

function Person(name) {
  this.name = name;
}

Person.prototype.greet = function greet() {
  return `Hi, ${this.name}`;
};

function Student(name) {
  this.__proto__.constructor(name);
}

Student.prototype.study = function study() {
  return `${this.name} is Studying`;
};

Object.setPrototypeOf(Student.prototype, Person.prototype);

const me = new Student("park");
console.log(me.greet());
console.log(me.study());

console.log(me instanceof Student);
console.log(me instanceof Person);

// 상속 받는 것 처럼 구현.
