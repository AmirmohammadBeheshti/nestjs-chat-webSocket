-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
