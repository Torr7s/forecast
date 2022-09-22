import { client } from './api-client';

function create(forecastData) {
  return client('api/beaches', { body: forecastData });
}

function read() {
  return client('api/forecast');
}

export { create, read };
