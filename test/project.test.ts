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

describe("PROJECT", () => {
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


    test("project owner can delete project successfully", async () => {
        const response = await request(app)
            .delete(`/api/projects/${projectID}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
    })

    test("user who's not project owner cannot delete the project they're in.", async () => {
        const response = await request(app)
            .delete(`/api/projects/${projectID}`)
            .set("Authorization", `Bearer ${memberToken}`)

        expect(response.status).toBe(403)
    })

    test("only project owner can add members", async () => {
        const response = await request(app)
            .post(`/api/projects/${projectID}/members`)
            .send({
                email: "nonMember@g.com"
            })
            .set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(200)
        
    })

    test("user who's not project owner cannot add members",async()=>{
         const response = await request(app)
            .post(`/api/projects/${projectID}/members`)
            .send({
                email: "nonMember@g.com"
            })
            .set("Authorization", `Bearer ${memberToken}`)

            expect(response.status).toBe(403)
    })
    test("non-member cannot access project details",async()=>{
        const response = await request(app)
        .get(`/api/projects/${projectID}`)
        .set("Authorization",`Bearer ${nonMemberToken}`)

        expect(response.status).toBe(403)
    })



})