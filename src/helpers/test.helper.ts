import chai from 'chai';
import _ from 'lodash';
import { IAnyObject, IResDataAssertionProps, IResDataAssertions } from '../@types/app.type';
import { THttpCode } from '../@types/constants.type';
const expect = chai.expect;
const should = chai.should();

import server from '../app';

/**
 * Bad POST request test
 * @param {route} route - the POST route being tested
 * @param {string} title - title of the test
 * @param {IAnyObject} data - data to be tested
 * @param {IResDataAssertions} dataAssertions - any other assert options
 * @param {THttpCode} statusCode - expected http status code
 */
export const testBadPostRequest = (route: string, title: string, data: IAnyObject, dataAssertions: IResDataAssertions = {}, statusCode: THttpCode = 400) => {
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
            if (!_.isEmpty(dataAssertions)) {
                //other should haves
                resDataAssertions(res, dataAssertions);
            }
            done();
        });
    });
}

/**
 * Good POST request test
 * @param {route} route - the POST route being tested
 * @param {string} title - title of the test
 * @param {IAnyObject} data - data to be tested
 * @param {IResDataAssertions} dataAssertions - any other assert options
 * @param {THttpCode} statusCode - expected http status code
 */
export const testGoodPostRequest = (route: string, title: string, data: IAnyObject, dataAssertions: IResDataAssertions = {}, statusCode: THttpCode = 201) => {
    return it(title, (done) => {
        chai.request(server)
        .post(route)
        .send(data)
        .end((err, res) => {
            console.log(res.body);
            should.not.exist(err);
            res.should.have.status(statusCode);
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql(true);
            res.body.should.have.property('data');
            if (!_.isEmpty(dataAssertions)) {
                //data assertions
                resDataAssertions(res, dataAssertions);
            }
            done();
        });
    });
}

/**
 * Get request test
 * @param {route} route - the POST route being tested
 * @param {string} title - title of the test
 * @param {IAnyObject} data - data to be tested
 * @param {IResDataAssertions} dataAssertions - any other assert options
 * @param {THttpCode} statusCode - expected http status code
 */
export const testGetRequest = (route: string, title: string, data: IAnyObject, dataAssertions: IResDataAssertions = {}, statusCode: THttpCode = 400) => {
    return it(title, (done) => {
        book.save((err, book) => {
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
            if (!_.isEmpty(dataAssertions)) {
                //other should haves
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
    for (let prop in dataAssertions) {
        const { value, check = null }: IResDataAssertionProps = dataAssertions[prop];
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
            case 'exists':
            default:
                res.body.data.should.have.property(prop); //just check for existence
                break;
        }
    }
}