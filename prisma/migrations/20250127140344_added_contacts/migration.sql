-- CreateTable
CREATE TABLE "_UserContactRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserContactRelation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserContactRelation_B_index" ON "_UserContactRelation"("B");

-- AddForeignKey
ALTER TABLE "_UserContactRelation" ADD CONSTRAINT "_UserContactRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserContactRelation" ADD CONSTRAINT "_UserContactRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
