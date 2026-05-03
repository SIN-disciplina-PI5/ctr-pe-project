services:
  postgres:
    image: postgres:16-alpine
    container_name: ctrpe-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ctrpe
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
