Output yang Diharapkan

PASS  test/app.test.js
  Unit Testing: JWT Auth System
    ✓ generateToken harus menghasilkan JWT yang valid (xx ms)
  Integration Testing: /login dan /protected
    ✓ /login: harus mengembalikan token untuk kredensial valid (xx ms)
    ✓ /login: harus gagal untuk kredensial tidak valid (xx ms)
    ✓ /protected: harus berhasil diakses dengan token yang valid (xx ms)
    ✓ /protected: harus gagal diakses tanpa token (xx ms)
    ✓ /protected: harus gagal diakses dengan token yang salah (xx ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
