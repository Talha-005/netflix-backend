const request = require('supertest');
const moment = require('moment');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');

describe('/mts/return', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec = () => {
        return request(server)
            .post('/mts/returns')
            .set('x-auth-token', token)
            .send({ movieId, customerId });
    };

    beforeEach(async () => {
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '113342',
            dailyRentalRate: 2,
            genre:{name:'uthjgawd'},
            numberInStock:10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '0997665855'
            },
            movie: {
                _id: movieId,
                title: 'titleMovie',
                dailyRentalRate: 2
            }
        });

        await rental.save();
    });
    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should Work.', async () => {
        const res = await Rental.findById(rental._id);
        expect(res).not.toBeNull();
    });

    it('should return 401 if client not logged in.', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId not logged in.', async () => {
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId not logged in.', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for customer/movie', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async () => {

        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have valid request', async () => {

        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set returnedDate idf input is valid', async () => {

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set rentalFee idf input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase movie stock', async () => {
        const res = await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock+1);
    });

    it('should return rental if input is valid', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut','dateReturned','rentalFee','movie','customer']));
    });

});