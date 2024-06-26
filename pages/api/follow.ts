import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    if (req.method != 'POST' && req.method != 'DELETE') {
        return res.status(405).end();
    }

    try {
        const { userId } = req.body;

        const { currentUser } = await serverAuth(req, res);

        if (!userId || typeof userId != 'string') {
            throw new Error('Invalid ID')
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user) {
            throw new Error('Invalid ID')
        }

        let updateFollowingIds = [...(user.followingIds || [])]

        if(req.method == 'POST') {
            updateFollowingIds.push(userId)
        }

        if(req.method == 'DELETE') {
            updateFollowingIds = updateFollowingIds.filter(followingId => followingId != userId);
        }

        const updateUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                followingIds: updateFollowingIds
            }
        });

        return res.status(200).json(updateUser);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}