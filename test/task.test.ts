import { prisma } from "../src/db/db.js"
import { test, expect, beforeAll, afterAll, beforeEach, describe, it } from "vitest"
import request from "supertest"
import app from "../src/app.js"

beforeAll(async () => {
    await prisma.$connect()

    await prisma.$queryRaw`SELECT 1`

    console.log("Test database connected successfully")
})

afterAll(async () => {
    await prisma.$disconnect()
})


describe("TASK",()=>{
    let token: string
    let projectID: string
    let memberToken: string
    let nonMemberToken : string;
    beforeEach(async () => {
        await prisma.task.deleteMany();
            await prisma.projectMember.deleteMany();
            await prisma.project.deleteMany();
            await prisma.user.deleteMany();
        //register owner
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "testUser",
                email: `a@g.com`,
                password: "12345678",
            });
        //login owner
        const login = await request(app)
            .post("/api/auth/login")
            .send({
                email: `a@g.com`,
                password: "12345678",
            });

        token = login.body.data.accessToken

        //make the owner create project
        const project = await request(app)
            .post("/api/projects")
            .send({
                name: "project 1",
                description: "its a good project"
            })
            .set("Authorization", `Bearer ${token}`)

        projectID = project.body.data.id

        //register another user
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "testUser2",
                email: `member@g.com`,
                password: "12345678",
            });
        //make him login
        const member = await request(app)
            .post("/api/auth/login")
            .send({
                email: `member@g.com`,
                password: "12345678",
            });
        memberToken = member.body.data.accessToken

        //get him added in the project via the project owner
         await request(app)
        .post(`/api/projects/${projectID}/members`)
        .send({
            email : "member@g.com"
        })
        .set("Authorization",`Bearer ${token}`)

        //non member register
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "testUser3",
                email: `nonMember@g.com`,
                password: "12345678",
            });
        //non member login
        const nonMemberLogin = await request(app)
            .post("/api/auth/login")
            .send({
                email: `nonMember@g.com`,
                password: "12345678",
            });
            nonMemberToken = nonMemberLogin.body.data.accessToken


    },30000)

    test("invalid assignee is rejected", async () => {
    const response = await request(app)
        .post(`/api/projects/${projectID}/tasks`)
        .send({
            title: "Test task",
            description: "Testing invalid assignee",
            priority: "MEDIUM",
            assigneeId: "some-user-id-that-is-not-a-project-member"
        })
        .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(400)
})

// test("task filtering works", async () => {
//     // Create a TODO task
//     await request(app)
//         .post(`/api/projects/${projectID}/tasks`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//             title: "Todo task",
//             description: "This should not appear",
//             status: "TODO",
//             priority: "MEDIUM"
//         })

//     // Create a DONE task
//     const doneTask = await request(app)
//         .post(`/api/projects/${projectID}/tasks`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//             title: "Done task",
//             description: "This should appear",
//             status: "DONE",
//             priority: "HIGH"
//         })

//     expect(doneTask.status).toBe(201)

//     // Fetch only DONE tasks
//     const response = await request(app)
//         .get(`/api/projects/${projectID}/tasks?status=DONE`)
//         .set("Authorization", `Bearer ${token}`)

//     expect(response.status).toBe(200)

//     expect(response.body.data.tasks).toHaveLength(1)
//     expect(response.body.data.tasks[0].status).toBe("DONE")
//     expect(response.body.data.tasks[0].title).toBe("Done task")
// })

// test("completedAt is set when task becomes DONE", async () => {
//     const task = await request(app)
//         .post(`/api/projects/${projectID}/tasks`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//             title: "Task to complete",
//             description: "Testing completedAt",
//             priority: "MEDIUM"
//         })

//     expect(task.status).toBe(201)

//     const taskId = task.body.data.id

//     const response = await request(app)
//         .patch(`/api/tasks/${taskId}`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//             status: "DONE"
//         })

//     expect(response.status).toBe(200)
//     expect(response.body.data.status).toBe("DONE")
//     expect(response.body.data.completedAt).not.toBeNull()
// })

// test("completedAt is cleared when task is reopened", async () => {
//     const task = await request(app)
//         .post(`/api/projects/${projectID}/tasks`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//             title: "Task to reopen",
//             description: "Testing completedAt clearing",
//             priority: "MEDIUM"
//         })

//     expect(task.status).toBe(201)

//     const taskId = task.body.data.id

//     // Complete the task
//     const completed = await request(app)
//         .patch(`/api/tasks/${taskId}`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//             status: "DONE"
//         })

//     expect(completed.status).toBe(200)
//     expect(completed.body.data.completedAt).not.toBeNull()

//     // Reopen the task
//     const reopened = await request(app)
//         .patch(`/api/tasks/${taskId}`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//             status: "TODO"
//         })

//     expect(reopened.status).toBe(200)
//     expect(reopened.body.data.status).toBe("TODO")
//     expect(reopened.body.data.completedAt).toBeNull()
// })

// test("non-member cannot update a task", async () => {
//     const task = await request(app)
//         .post(`/api/projects/${projectID}/tasks`)
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//             title: "Protected task",
//             description: "Testing authorization",
//             priority: "MEDIUM"
//         })

//     expect(task.status).toBe(201)

//     const taskId = task.body.data.id

//     const response = await request(app)
//         .patch(`/api/tasks/${taskId}`)
//         .set("Authorization", `Bearer ${nonMemberToken}`)
//         .send({
//             status: "DONE"
//         })

//     expect(response.status).toBe(403)
// })
})