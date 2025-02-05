# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Accept build argument
ARG DATABASE_URL
ARG REDIS_URL
ARG AUTH_SECRET
ARG TZ
ARG GITHUB_ID
ARG GITHUB_SECRET
ARG GOOGLE_ID
ARG GOOGLE_SECRET
ARG GITLAB_ID
ARG GITLAB_SECRET
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG BREVO_USER
ARG BREVO_PASS

# Set environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV AUTH_SECRET=${AUTH_SECRET}
ENV TZ=${TZ}
ENV GITHUB_ID=${GITHUB_ID}
ENV GITHUB_SECRET=${GITHUB_SECRET}
ENV GOOGLE_ID=${GOOGLE_ID}
ENV GOOGLE_SECRET=${GOOGLE_SECRET}
ENV GITLAB_ID=${GITLAB_ID}
ENV GITLAB_SECRET=${GITLAB_SECRET}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
ENV BREVO_USER=${BREVO_USER}
ENV BREVO_PASS=${BREVO_PASS}

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# copy prisma schema
COPY prisma ./prisma

# Install dependencies
RUN yarn install

ENV NODE_ENV=production

# Copy the rest of the application code
COPY . .

# Enable SSH forwarding in the build
RUN mkdir -p ~/.ssh && chmod 0700 ~/.ssh

# Build the Next.js application
RUN --mount=type=ssh yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]