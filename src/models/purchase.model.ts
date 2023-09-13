import { PrismaClient, ReceiptPayMode, ReceiptState } from '@prisma/client'
import jwt from '../services/jwt';


const prisma = new PrismaClient()

interface NewGuestReceiptDetail {
    productId: string;
    quantity: number;
}

interface GuestReceiptDetail extends NewGuestReceiptDetail{
    id: string;
    guestReceiptId: string;
}


interface NewGuestReceipt {
    email: string;
    phoneNumber: string;
    total: number;
    payMode: ReceiptPayMode;
    paid?: boolean;
}

interface GuestReceipt extends NewGuestReceipt {
    id: string;
    state?: ReceiptState;
    createAt: Date;
    acceptTime?: Date;
    shippingTime?: Date;
    doneTime?: Date;
    guestReceiptDetail: GuestReceiptDetail[];
}
export default {
    createGuestReceipt: async function(newGuestReceipt: NewGuestReceipt, guestReceiptDetailList: NewGuestReceiptDetail[]) {
        try {
            let receipt = await prisma.guestReceipts.create({
                data: {
                    ...newGuestReceipt,
                    guestReceiptDetail: {
                        createMany: {
                            data: guestReceiptDetailList
                        }
                    }
                },
                include: {
                    guestReceiptDetail: true
                }
            })
            return {
                status: true,
                message: "Order thành công!",
                data: receipt
            }
        }catch(err) {
            console.log("err", err)
            return {
                status: false,
                message: "Lỗi model!",
                data: null
            }
        }
    },
    findGuestReceipt: async function(guestEmail: string) {
        try {
            let receipts = await prisma.guestReceipts.findMany({
                where: {
                    email: guestEmail
                },
                include: {
                    guestReceiptDetail: true
                }
            })
            return {
                status: true,
                message: "Lấy danh sách order thành công! ",
                data: receipts
            }
        }catch(err) {
            return {
                status: false,
                message: "Lỗi model!",
                data: null
            }
        }
    },
    createOrder: async function(data: any) {
        console.log("data", data);
        
        try {
   //giải nén token
   let uncode:any = jwt.verifyToken(data.token);
   console.log("uncode",uncode);
   
   if(uncode){
    let receipts = await prisma.userOrder.create({
        data: {
            userId: uncode.id,
            data :  data.data,
          }
    })
    console.log("receipts",receipts);
    
    return {
        status:true,
        message:"Tạo đơn hàng thành công"}
   }else{
        return {
            status:false,
            message:"Chưa đăng nhập",
            data:null
        }
     }
        }catch(err) {
            console.log("eeeeeeeeeeeeerrr",err);
            
            return {
                status: false,
                message: "Lỗi model!",
                data: null
            }
        }
    },
    getOrder: async function(data: any) {
        console.log("data123", data);
        
        try {
   //giải nén token
   let uncode:any = jwt.verifyToken(data.token);
   console.log("uncode",uncode);
   
   if(uncode){

    let receipts = await prisma.userOrder.findMany()
    console.log("receipts",receipts);
    
    return {status:true,
            message:"Lấy đơn hàng thành công",
            data:receipts
        }
   }else{
        return {
            status:false,
            message:"Chưa đăng nhập",
            data:null
        }
   }
        }catch(err) {
            console.log("err",err);
            return {
                status: false,
                message: "Lỗi model!",
                data: null
            }
        }
    }
}                                           