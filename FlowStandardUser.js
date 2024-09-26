import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { BASE_URL, TODO_PATH } from "../Utils/const.js";

const index = [1, 2, 3, 4]
const ENDPOINT = BASE_URL + TODO_PATH

// Seleccionar el tipo de prueba deseado en el README
// También ajustar los valores a los estimados de la aplicación
// -- Load Test ---
export let options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 150 },
    { duration: "1m", target: 150 },
    { duration: "1m", target: 200 },
    { duration: "1m", target: 250 },
    { duration: "1m", target: 50 },
    { duration: "1m", target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Tasa de error menor al 1 %
    http_req_duration: ['p(90)<200'], // El 95% de las peticiones deben responder en menos de 200ms
  }
};

export default function () {
  
  const response = http.get(
    ENDPOINT, 
    { headers: { Accepts: "application/json" } }
  );
  check(response, { "Status Code Index is 200": (r) => r.status === 200 });
  sleep(.300);

  const responseShow = http.get(
    `${ENDPOINT}/${randomItem(index)}`,
    { headers: { Accepts: "application/json" } }
  );
  check(responseShow, { "Status Code Show is 200": (r) => r.status === 200 });
  sleep(.300);

  const body = {
    "title": randomString(8),
    "description": randomString(18),
    "completed": false
  }

  const responseCreate = http.post(
    ENDPOINT,
    JSON.stringify(body),
    { headers: { Accepts: "application/json" } }
  );

  check(responseCreate, { "Status Code Create is 201": (r) => r.status === 201 });
  sleep(.300);
};