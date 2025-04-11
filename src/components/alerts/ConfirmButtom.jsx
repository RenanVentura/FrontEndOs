import Swal from "sweetalert2";

export default async function ConfirmButton() {
  const result = await Swal.fire({
    title: "Deseja realmente deletar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, deletar",
    cancelButtonText: "Cancelar",
  });

  return result.isConfirmed;
}
