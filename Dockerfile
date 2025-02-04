# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Install PostgreSQL client to use pg_isready
RUN apt-get update && apt-get install -y postgresql-client

# Accept build argument for DATABASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Check if the database is available
RUN for i in {1..10}; do \
      if pg_isready -h localhost -p 5432; then \
        echo "Database is available"; \
        break; \
      fi; \
      echo "Waiting for database to be available..."; \
      sleep 5; \
    done

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# copy prisma schema
COPY prisma ./prisma

# Install dependencies
RUN yarn install

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