import { useActionData, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { getQRCode } from "../models/QRCode.server";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }) {
    const {admin} = await authenticate.admin(request);

    if(params.id === "new") {
        return json({
            destination:"product",
            title:"",
        });
    }

    return json(await getQRCode(Number(params.id), admin.graphql));
}

export default function QRCodeForm() {
    const errors = useActionData()?.errors || {};
    const qrCode = useLoaderData();
    const[formState, setFormState] = useState(qrCode);
    const [cleanFormState, setCleanFormState] = useState(qrCode);
    const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);
    const nav = useNavigation();
    const isSaving = 
        nav.state ==="submitting" && nav.formData?.get("action") !== "delete";
    const isDeleting = 
        nav.state === "submitting" && nav.formData?.get("action") === "delete";
}

async function selectProduct() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select", // customized action verb, either 'select' or 'add',
    });

    if (products) {
      const { images, id, variants, title, handle } = products[0];

      setFormState({
        ...formState,
        productId: id,
        productVariantId: variants[0].id,
        productTitle: title,
        productHandle: handle,
        productAlt: images[0]?.altText,
        productImage: images[0]?.originalSrc,
      });
    }
  }