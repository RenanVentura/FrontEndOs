import Swal from "sweetalert2";

export default function DoneForm() {
  return Swal.fire({
    title: "Enviado com Sucesso!",
    icon: "success",
    draggable: true,
  });
}
