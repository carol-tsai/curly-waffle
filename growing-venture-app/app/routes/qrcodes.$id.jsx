import invariant from "tiny-invariant";
import db from "../db.server";
import { getQRCodeImage } from "../models/QRCode.server";


export const loader = async ({ params}) => {
    invariant(params.id, "Count not find QR Code destination");
     const id = Number(params.id);
     const qrCode = await db.qRCode.findFirst({where: {id} });
      invariant(qrCode, "Count not find QR code destination");

      return json({
        title: qrCode.title,
        image: await getQRCodeImage(id),
      });
};

export default function QRCode() {
    const {image, title} = useLoaderData();

    return (
        <>
            <h1>{title}</h1>
            <img src={image} alt={`QR Code for product`} />
        </>
    );

}