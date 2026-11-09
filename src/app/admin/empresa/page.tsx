"use client";

import { GuardaAdmin } from "@/components/admin/GuardaAdmin";
import { FormEmpresa } from "@/components/admin/FormEmpresa";

// /admin/empresa/ = novo; /admin/empresa/?id=... = editar.
// (Site estático: o id vai na query, não no caminho.)
export default function PaginaEmpresaAdmin() {
  return <GuardaAdmin>{() => <FormEmpresa />}</GuardaAdmin>;
}
