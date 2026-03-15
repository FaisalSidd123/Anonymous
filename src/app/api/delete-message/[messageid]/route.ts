import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

import { User } from "next-auth";

export async function DELETE(request:Request,{params}: {params: Promise<{messageid:string}>}){
    const { messageid } = await params;
    const messageId = messageid;
    await dbConnect()

      const session = await getServerSession(authOptions)
        const user: User = session?.user as User
    
        if(!session || !session.user){
             return Response.json({
                success: false,
                message: "Not Authenticated"
            }, {
                status: 401
            })
        }
    
            try {
              const updatedResult =   await UserModel.updateOne(
                    {_id: new mongoose.Types.ObjectId(user._id)},
                    {$pull:{messages: {_id: new mongoose.Types.ObjectId(messageId)}}}
                )
                if(updatedResult.modifiedCount == 0){
                     return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, {
                status: 404
            })
                }

                 return Response.json({
                success: true,
                message: "Message deleted successfully"
            }, {
                status: 200
            })
            } catch (error) {
                console.log("Error in delete message route, error",error)
                 return Response.json({
                success: false,
                message: "Error deleting message"
            }, {
                status: 500
            })
            }       
}