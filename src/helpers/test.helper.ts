import chai from 'chai';
import _ from 'lodash';
import { IAnyObject } from '../@types/app.type';
import { THttpCode } from '../@types/constants.type';
import { IResDataAssertions, IResDataAssertionProps, TResDataAssertionType } from '../@types/test.type';
const expect = chai.expect;
const should = chai.should();

import server from '../app';


/**
 * Bad POST request test
 * @param {route} route - the POST route being tested
 * @param {string} title - title of the test
 * @param {IAnyObject} data - data to be tested
 * @param {THttpCode} statusCode - expected http status code
 */
export const testBadPostRequest = (route: string, title: string, data: IAnyObject, statusCode: THttpCode = 400) => {
    return it(title, (done) => {
        chai.request(server)
        .post(route)
        .send(data)
        .end((err, res) => {
            // console.log(res.body);
            should.not.exist(err);
            res.should.have.status(statusCode);
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql(false);
            res.body.should.have.property('message').not.eql(null);
            done();
        });
    });
}


/**
 * Good POST request test
 * @param {route} route - the POST route being tested
 * @param {string} title - title of the test
 * @param {IAnyObject} data - data to be tested
 * @param {IResDataAssertions} dataAssertions - assertions on the return data
 * @param {THttpCode} statusCode - expected http status code
 * @param {TResDataAssertionType} dataType - data type
 */
export const testGoodPostRequest = (route: string, title: string, data: IAnyObject, dataAssertions: IResDataAssertions | null = {}, statusCode: THttpCode = 201, dataType: TResDataAssertionType = 'object') => {
    return it(title, (done) => {
        chai.request(server)
        .post(route)
        .send(data)
        .end((err, res) => {
            // console.log(res.body);
            should.not.exist(err);
            res.should.have.status(statusCode);
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql(true);
            res.body.should.have.property('data');
            res.body.data.should.be.an(dataType);
            if (dataAssertions && !_.isEmpty(dataAssertions)) {
                // assertions on the returned data
                resDataAssertions(res, dataAssertions);
            }
            done();
        });
    });
}


/**
 * Bad GET request test
 * @param {route} route - the POST route being tested
 * @param {string} title - title of the test
 * @param {THttpCode} statusCode - expected http status code
 */
export const testBadGetRequest = (route: string, title: string, statusCode: THttpCode = 400) => {
    return it(title, (done) => {
        chai.request(server)
        .get(route)
        .end((err, res) => {
            // console.log(res.body);
            should.not.exist(err);
            res.should.have.status(statusCode);
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql(false);
            res.body.should.have.property('message').not.eql(null);
            done();
        });
    });
}


/**
 * Good GET request test
 * @param {route} route - the POST route being tested
 * @param {string} title - title of the test
 * @param {IResDataAssertions} dataAssertions - assertions on the return data
 * @param {THttpCode} statusCode - expected http status code
 * @param {TResDataAssertionType} dataType - data type
 */
export const testGoodGetRequest = (route: string, title: string, dataAssertions: IResDataAssertions | null = {}, statusCode: THttpCode = 200, dataType: TResDataAssertionType = 'object') => {
    return it(title, (done) => {
        chai.request(server)
        .get(route)
        .end((err, res) => {
            // console.log(res.body);
            should.not.exist(err);
            res.should.have.status(statusCode);
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql(true);
            res.body.should.have.property('data');
            res.body.data.should.be.an(dataType);
            if (dataAssertions && !_.isEmpty(dataAssertions)) {
                // assertions on the returned data
                resDataAssertions(res, dataAssertions);
            }
            done();
        });
    });
}


/**
 * Response data assertions i.e res.body.data
 * @param {request.Response} res - the response object
 * @param {IResDataAssertions} dataAssertions - the response data assertions
 */
const resDataAssertions = (res: any, dataAssertions: IResDataAssertions) => {
    if (_.isEmpty(dataAssertions)) return;
    // console.log(res.body.data);
    for (let prop in dataAssertions) {
        const { value, check = null }: IResDataAssertionProps = dataAssertions[prop];
        const valuesArr = <string[]>value;
        switch (check) {
            case 'length':
                res.body.data.should.have.property(prop); //first checck for existence
                expect(res.body.data[prop]).to.have.lengthOf(<number>value);
                break;
            case 'equal':
                res.body.data.should.have.property(prop).eql(value);
                break;
            case 'notEqual':
                res.body.data.should.have.property(prop).not.eql(value);
                break;
            case '+props':
                res.body.data.should.have.keys(...valuesArr);
                break;
            case '-props':
                res.body.data.should.not.have.keys(...valuesArr);
                break;
            case 'exists':
            default:
                res.body.data.should.have.property(prop); //just check for existence
                break;
        }
    }
}