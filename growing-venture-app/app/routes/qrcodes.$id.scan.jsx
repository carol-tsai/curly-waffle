import invariant from "tiny-invariant";
import db from "../db.server";
import { redirect } from "react-router";
import { getDestinationUrl } from "../models/QRCode.server";

export const loader = async({params}) => {
    invariant(params.id, "Could not find QR code destination");

    const id = Number(params.id);
    const qrCode = await db.qRCode.findFirst({ where: { id }});
    invariant(qrCode, "Count not find QR Cod destination");

    await db.qRCode.update({
        where: { id },
        data: { scans: { increment: 1 }},
    });

    return redirect(getDestinationUrl(qrCode));
};