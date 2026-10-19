import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('GET /products (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the first page with default pagination', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(body).toMatchObject({
      page: 1,
      limit: 10,
      total: 30,
      totalPages: 3,
    });
    expect(body.data).toHaveLength(10);
  });

  it('filters by category and paginates the filtered list', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/products?category=Food&limit=4')
      .expect(200);

    expect(body.total).toBe(6);
    expect(body.totalPages).toBe(2);
    expect(body.data).toHaveLength(4);
    expect(
      body.data.every((p: { category: string }) => p.category === 'Food'),
    ).toBe(true);
  });

  it('filters by stock status', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/products?stock_status=out_of_stock&limit=100')
      .expect(200);

    expect(body.data.length).toBeGreaterThan(0);
    expect(
      body.data.every(
        (p: { stock_status: string }) => p.stock_status === 'out_of_stock',
      ),
    ).toBe(true);
  });

  it('rejects a limit above the maximum with a formatted error', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/products?limit=500')
      .expect(400);

    expect(body).toMatchObject({
      statusCode: 400,
      path: '/products?limit=500',
    });
    expect(body.message).toContain('limit must not be greater than 100');
    expect(typeof body.timestamp).toBe('string');
  });

  it('rejects a non numeric page', async () => {
    await request(app.getHttpServer()).get('/products?page=abc').expect(400);
  });

  it('rejects an unknown stock status', async () => {
    await request(app.getHttpServer())
      .get('/products?stock_status=banana')
      .expect(400);
  });

  it('returns a formatted 404 for an unknown route', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/unknown')
      .expect(404);

    expect(body.statusCode).toBe(404);
    expect(body.path).toBe('/unknown');
  });
});
