
# --- Base ---
FROM node:12-alpine AS base

# --- Dependencies ---
FROM base AS dependencies

# Copy chewiebot to docker
WORKDIR /usr/src/chewiebot/server
COPY package.json .
# Install git for package installations
RUN apk add --no-cache git
# install node packages
RUN yarn install --prod 
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
# RUN yarn install


# --- Typescript ---
FROM base AS typescript
WORKDIR /usr/src/chewiebot/server
# Copy only prod dependencies
COPY --from=dependencies /usr/src/chewiebot/server/prod_node_modules ./node_modules
# Copy src
COPY . .
# Install and run typescript
RUN yarn global add typescript -y
RUN tsc

# --- Production ---

FROM base AS prod
WORKDIR /usr/src/chewiebot/server
COPY --from=typescript /usr/src/chewiebot/server .
# Install pm2
RUN yarn global add pm2 -y
# Start
WORKDIR /usr/src/chewiebot/server/dist
EXPOSE 8080
CMD ["pm2-runtime", "start.js"]

USER node