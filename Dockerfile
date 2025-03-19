FROM node:lts AS base

FROM base AS deps
WORKDIR /app
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn global add dotenv-cli
RUN dotenv -e .env.local -- yarn prisma migrate deploy
RUN yarn prisma generate 
RUN yarn build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD ["yarn", "start"]