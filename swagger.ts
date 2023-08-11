import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/routes/cardRoutes.ts"];

swaggerAutogen(outputFile, endpointsFiles);