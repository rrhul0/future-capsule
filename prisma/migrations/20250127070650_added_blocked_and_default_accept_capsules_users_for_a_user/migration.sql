-- CreateTable
CREATE TABLE "_DefaultAcceptUserRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DefaultAcceptUserRelation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BlockedUserRelation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlockedUserRelation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DefaultAcceptUserRelation_B_index" ON "_DefaultAcceptUserRelation"("B");

-- CreateIndex
CREATE INDEX "_BlockedUserRelation_B_index" ON "_BlockedUserRelation"("B");

-- AddForeignKey
ALTER TABLE "_DefaultAcceptUserRelation" ADD CONSTRAINT "_DefaultAcceptUserRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DefaultAcceptUserRelation" ADD CONSTRAINT "_DefaultAcceptUserRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUserRelation" ADD CONSTRAINT "_BlockedUserRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUserRelation" ADD CONSTRAINT "_BlockedUserRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
