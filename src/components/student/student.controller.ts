import { Application, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import makeValidateBody from '../../middleware/request-body-validator';
import createLogger from '../../lib/logger';
import BaseApi from '../base-api';
import CreateStudent from './create-student.request';
import CustomRequest from '../../abstractions/custom-request';
import ApiResponse from '../../abstractions/api-responses';
import Student from './student.model';
import ApiError from '../../abstractions/api-error';
import { StudentService } from './student.service';

const logger = createLogger('Student Controller');


export default class StudentController extends BaseApi {
    
    constructor(express: Application, private studentService = new StudentService()) {
        super();
        this.register(express);
        // if (process.env.pm_id === '0') logger.info(`Registering ${JSON.stringify(logger.defaultMeta?.service)}`);
    }


    public register(express: Application): void {
        express.use('/student', this.router);
        this.router.post('/create', makeValidateBody(CreateStudent), this.createStudent);
    }

    public createStudent = async (req: CustomRequest<CreateStudent>, res: Response<ApiResponse<Student> | ApiError>) => {
        try {

            logger.info('creating a new user');
            // const studentService = new StudentService();

            const isCreated = await this.studentService.create(req?.body);
            if (isCreated) {
                const newStudent = new Student();
                newStudent.firstName = req?.body?.firstName;
                newStudent.lastName = req?.body?.lastName;
                newStudent.birthDate = req?.body?.birthDate;
                newStudent.email = req?.body?.email;
                newStudent.phoneNumber = req?.body?.phoneNumber;
                newStudent.classId = req?.body?.classId;

                res.status(StatusCodes.OK)
                    .send(new ApiResponse(StatusCodes.OK, 'SUCCESS', newStudent, 'Student created successfully'));
            }
            else {
                res.status(StatusCodes.EXPECTATION_FAILED)
                    .send(new ApiError(StatusCodes.EXPECTATION_FAILED, 'FAILURE', 'Student could not be created'));
            }

        } catch (err: any) {
            if (err?.status === 'FAILURE') {
                logger.debug(err?.message);
                logger.debug(err?.stack);
                res.status(err?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(new ApiError(err?.statusCode, err?.status, err.message, err.name));
            }
            else {
                logger.error(err?.message);
                logger.error(err?.stack);
                res.status(err?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(new ApiError(err?.statusCode, 'ERROR', err.message, err.name));
            }
        }
    };

    

};