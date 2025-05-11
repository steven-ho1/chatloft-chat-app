FROM node:24.0.1 AS builder 
WORKDIR /server
COPY server/package*.json .
COPY common /common
RUN npm ci
COPY server .
RUN npm run build

# Remove devDependencies before copying to final image
RUN npm prune --production

FROM node:alpine AS final
WORKDIR /server
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/server/src/index.js"]

# From project root, build with: docker build -t <image-name:tag> -f server/Dockerfile .
# From server, build with: docker build -t <image-name:tag> -f Dockerfile ..

# Run with: docker run -p 3000:3000 --env-file .env <image-name:tag>