import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /', () => {
  it('should return status 200', async () => {
    const res = await chai.request(app).get('/');
    expect(res).to.have.status(200);
  });
});

describe('POST /contact', () => {
  it('should return status 302 and redirect to /pages/emailsub.html', async () => {
    const res = await chai.request(app)
      .post('/contact')
      .send({ email: 'test@example.com', message: 'Hello, world!' });

    expect(res).to.have.status(302);
    expect(res).to.redirectTo('/pages/emailsub.html');
  });
});

describe('GET /about', () => {
  it('should return status 200', async () => {
    const res = await chai.request(app).get('/about');
    expect(res).to.have.status(200);
  });
});

describe('GET /events/new', () => {
  it('should return status 200', async () => {
    const res = await chai.request(app).get('/events/new');
    expect(res).to.have.status(200);
  });
});

describe('GET /events/:slug', () => {
  it('should return status 200 if event is found', async () => {
    const knownSlug = 'known-event-slug';
    const res = await chai.request(app).get(`/events/${knownSlug}`);
    expect(res).to.have.status(200);
  });

  it('should redirect to / if event is not found', async () => {
    const nonExistentSlug = 'non-existent-slug';
    const res = await chai.request(app).get(`/events/${nonExistentSlug}`);
    expect(res).to.redirectTo('/');
  });
});

