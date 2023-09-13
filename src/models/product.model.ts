import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    create: async function(newProduct: any, productPictures: any) {
        try {
            let product = await prisma.products.create({
                data: {
                    ...newProduct,
                    productPictures: {
                        createMany: {
                            data: [
                                ...productPictures
                            ]
                        }
                    }
                },
                include: {
                    productPictures: true
                }
            });

            
            return {
                status: true,
                message: "Create product ok!",
                data: product
            }
        }catch(err) {
            console.log("lỗi model", err)
            return {
                status: false,
                message: "Lỗi model",
                data: null
            }
        }
    },
    findMany: async function() {
        try {
            let products = await prisma.products.findMany()

            return {
                status: true,
                message: "Get products ok",
                data: products
            }
        }
        catch (err) {
            return { 
                status: false,
                message: "Lỗi model",
                data: null
            }
        }
    },
    findById: async function(productId: string) {
        try {
            let product = await prisma.products.findUnique({
                where: {
                    id: productId
                },
                include: {
                    productPictures: true
                }
            });

            return {
                status: true,
                message: "Get product detail ok!",
                data: product
            }
        }catch(err) {
            return {
                status: false,
                message: "Lỗi model",
                data: null
            }
        }
    },
    // deleteById: async function(productId: string) {
    //     try {
    //         const product = await prisma.products.delete({
    //             where: {
    //                 id: productId
    //             },
    //             include: {
    //                 productPictures: true
    //             }
    //         });

    //         return {
    //             status: true,
    //             message: "Xóa sản phẩm thành công",
    //             data: product
    //         };
    //     } catch (err) {
    //         console.log(err);
    //         return {
    //             status: false,
    //             message: "Lỗi model",
    //             data: null
    //         };
    //     }
    // }
    deleteById: async function (productId: string) {
        try {
          // Kiểm tra xem sản phẩm có liên kết với hình ảnh sản phẩm hay không
          const product = await prisma.products.findUnique({
            where: {
              id: productId,
            },
            include: {
              productPictures: true,
            },
          });
    
          if (!product) {
            // Xử lý nếu sản phẩm không tồn tại
            return {
              status: false,
              message: "Sản phẩm không tồn tại",
              data: null,
            };
          }
    
          // Xóa hình ảnh sản phẩm trước
          const deletePicturePromises = product.productPictures.map(async (picture) => {
            await prisma.productPictures.delete({
              where: {
                id: picture.id,
              },
            });
          });
    
          // Chờ cho tất cả các hình ảnh được xóa
          await Promise.all(deletePicturePromises);
    
          // Sau khi xóa hình ảnh, bạn có thể xóa sản phẩm
          const deletedProduct = await prisma.products.delete({
            where: {
              id: productId,
            },
          });
    
          return {
            status: true,
            message: "Xóa sản phẩm thành công",
            data: deletedProduct,
          };
        } catch (err) {
          console.error("Lỗi model", err);
          return {
            status: false,
            message: "Lỗi model",
            data: null,
          };
        }
      },
}