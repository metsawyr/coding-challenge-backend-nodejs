# Stolen Bike Cases - JOIN Coding Challenge - Backend (Node.js)
![JOIN Stolen Bike Cases](https://github.com/join-com/coding-challenge-backend-nodejs/raw/master/illustration.png)

## Implementation detail and lacks
- Unit testing present only in one class, so you can see the way how it's usually done by me.

## Product Requirements
- [x] Bike owners can report a stolen bike.
- [x] A bike can have multiple characteristics: license number, color, type, full name of the owner, date, and description of the theft.
- [x] Police have multiple departments that are responsible for stolen bikes. 
- [x] A department can have some amount of police officers who can work on stolen bike cases.
- [x] The Police can scale their number of departments, and can increase the number of police officers per department.
- [ ] Each police officer should be able to search bikes by different characteristics in a database and see which department is responsible for a stolen bike case.
- [x] New stolen bike cases should be automatically assigned to any free police officer in any department.  
- [x] A police officer can only handle one stolen bike case at a time. 
- [x] When the Police find a bike, the case is marked as resolved and the responsible police officer becomes available to take a new stolen bike case. 
- [x] The system should be able to assign unassigned stolen bike cases automatically when a police officer becomes available.

## Project dependencies
- Node.js 10+
- NPM 6+
- Docker
- Git

## Installation
- Clone this repo with `git clone`
- Install dependencies `npm install`
- Build an application `npm run build`
- Pull required image `docker pull mysql:5.7`
- Run a MySQL database in container `docker run --name mysqldb -e MYSQL_ROOT_PASSWORD=supersonic -p 3306:3306 -d mysql:5.7`
- Init database structure `npm run dbinit`
- Run tests `npm test`
- Check test coverage `npm run coverage`
- Run an application `npm start`

## API
`POST /cases` - creates new case
Payload:
```
{
    "ownerName": string,
    "licenseNumber": string,
    "color": string,
    "district": number,             // 1 - 12 for Berlin's disctrict
    "stealDetails": string,     
    "type": string enum             // Bike type
}
```

`PATCH /cases/:id/close` - closes the case
Payload:
```
{
    "resolutionReport": string      // Details on closing case
}
```

## NOT IMPLEMENTED!

`GET /cases` - get cases list
Query params:
```
    ownerName: string,
    licenseNumber: string,
    color: string,
    district: number,
    type: string enum,
    status: string enum,
```