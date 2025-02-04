# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Accept build argument for DATABASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# copy prisma schema
COPY prisma ./prisma

# Install dependencies
RUN yarn install

ENV NODE_ENV=production

# Copy the rest of the application code
COPY . .

# # Accept build argument for DATABASE_URL
# ARG DATABASE_URL
# ENV DATABASE_URL=${DATABASE_URL}

# Build the Next.js application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]