import { test } from "node:test";
import assert from "node:assert/strict";
import { extrairYouTubeId, gerarSlug, normalizarInstagram, normalizarTelefone } from "./normalizar.ts";

test("slug tira acento, símbolo e espaço", () => {
  assert.equal(gerarSlug("Café & Pão São José"), "cafe-e-pao-sao-jose");
  assert.equal(gerarSlug("  --Academia   Altitude!! "), "academia-altitude");
});

test("youtube aceita ID ou qualquer link", () => {
  assert.equal(extrairYouTubeId("aqz-KE-bpKQ"), "aqz-KE-bpKQ");
  assert.equal(extrairYouTubeId("https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=3"), "aqz-KE-bpKQ");
  assert.equal(extrairYouTubeId("https://youtu.be/aqz-KE-bpKQ?si=x"), "aqz-KE-bpKQ");
  assert.equal(extrairYouTubeId("https://youtube.com/shorts/aqz-KE-bpKQ"), "aqz-KE-bpKQ");
  assert.equal(extrairYouTubeId(""), "");
  assert.equal(extrairYouTubeId("lixo"), null);
});

test("telefone vira só dígitos com 55", () => {
  assert.equal(normalizarTelefone("(17) 99999-8888"), "5517999998888");
  assert.equal(normalizarTelefone("+55 17 3222-1111"), "551732221111");
  assert.equal(normalizarTelefone(""), "");
});

test("instagram vira só o usuário", () => {
  assert.equal(normalizarInstagram("@cafe.nuvem"), "cafe.nuvem");
  assert.equal(normalizarInstagram("https://www.instagram.com/cafe_nuvem/"), "cafe_nuvem");
});
