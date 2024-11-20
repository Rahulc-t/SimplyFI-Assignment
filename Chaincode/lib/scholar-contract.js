'use strict';

const { Contract } = require('fabric-contract-api');


class ScholarshipContract extends Contract {

    // Initialize the ledger with no students
    async initLedger(ctx) {
        console.log('Scholarship Ledger Initialized');
    }

    

    // University submits a list of students
    async submitStudentList(ctx, id, name, marks) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'universityMSP') {
            throw new Error('Only university MSP can add students.');
        }

        const existingStudent = await ctx.stub.getState(id);
        if (existingStudent && existingStudent.length > 0) {
            throw new Error(`Student with ID ${id} already exists and cannot avail the scholarship more than once.`);
        }

        const student = {
            id,
            name,
            marks,
            status: 'Submitted', 
            fundDisbursed: false 
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(student)));
        return JSON.stringify(student);
    }

   // Process a single student's details based on their marks
    async processStudentStatus(ctx, id) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'scholarshipDepartmentMSP') {
            throw new Error('Only scholarship department MSP can verify students.');
        }
 
        const student = await this._getStudent(ctx, id);
        student.status = student.marks >= 60 ? 'Verified' : 'Rejected';
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(student)));
        return JSON.stringify(student);
    }

    
    // Auditor reviews the status of a student
    async queryStudent(ctx, id) {
        const student = await this._getStudent(ctx, id);
        return JSON.stringify(student);
    }

   

       
    

    // Query all students by a specific status
    async queryStudentsByStatus(ctx, status) {
        const queryString = {
            selector: {
                status: status
            }
        };
        const students = await this._getQueryResult(ctx, JSON.stringify(queryString));
        return JSON.stringify(students);
    }

    // University updates student details if they have "Submitted" status
    async updateStudentDetails(ctx, id, name, marks) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'universityMSP') {
            throw new Error('Only university MSP can update student details.');
        }

        const student = await this._getStudent(ctx, id);
        if (student.status !== 'Submitted') {
            throw new Error('Only students with "Submitted" status can be updated.');
        }

        student.name = name;
        student.marks = marks;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(student)));
        return JSON.stringify(student);
    }

   

   

    // University deletes a student record with "Submitted" status
    async deleteStudentRecord(ctx, id) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'universityMSP') {
            throw new Error('Only university MSP can delete student records.');
        }

        const student = await this._getStudent(ctx, id);
        if (student.status !== 'Submitted') {
            throw new Error('Only students with "Submitted" status can be deleted.');
        }

        await ctx.stub.deleteState(id);
        return `Student with ID ${id} has been deleted.`;
    }

    async getHistory(ctx, id) {
        const iterator = await ctx.stub.getHistoryForKey(id);
        const history = [];
        let res = await iterator.next();

        while (!res.done) {
            const record = {
                txId: res.value.txId,
                timestamp: res.value.timestamp,
                isDelete: res.value.isDelete,
                value: res.value.value.toString() ? JSON.parse(res.value.value.toString()) : null
            };
            history.push(record);
            res = await iterator.next();
        }

        await iterator.close();
        return JSON.stringify(history);
    }



    // Internal helper function to get the student data
    async _getStudent(ctx, id) {
        const studentJSON = await ctx.stub.getState(id);
        if (!studentJSON || studentJSON.length === 0) {
            throw new Error(`Student with ID ${id} does not exist`);
        }
        return JSON.parse(studentJSON.toString());
    }

    // Internal helper to query the ledger with a custom selector
    async _getQueryResult(ctx, queryString) {
        const iterator = await ctx.stub.getQueryResult(queryString);
        const results = [];
        let res = await iterator.next();

        while (!res.done) {
            const result = res.value.value.toString('utf8');
            results.push(JSON.parse(result));
            res = await iterator.next();
        }

        await iterator.close();
        return results;
    }
}

module.exports = ScholarshipContract;
