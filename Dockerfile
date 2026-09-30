

# ---------- Stage 1: dev (Vite dev server with hot reload) ----------
# Used by docker-compose.dev.yml (target: dev) with the code mounted as a volume.
FROM node:22-alpine AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
# --host so the dev server is reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------- Stage 2: build the static site ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# The API address is written into the built files, so it is set at build
# time (docker compose passes it as a build argument).
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- Stage 3: final image, nginx serving dist/ ----------
FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
