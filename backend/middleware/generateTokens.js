import jwt from "jsonwebtoken";

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQC0tv6ptuEJ/l3afd8Zedukagy6LZNuC7dcUKi6DD6f3Q8jGMpu
kd/nVLWiQHikIlmS9lSSzCHB9IRqC9h8UI0/fs8y7oILq58ikMJcs4lAIndH0udq
qcDniIc7VdN2sfPlg1zursCKFnj6GsV32+TaH6OIbAbwfO4UzRAUIW8vtwIDAQAB
AoGBAJdrcazAuIUIJpnJuCL/kQONfIaPY6XkmUn3p7jkQ6DtuB4/SnclMYgC2YJP
JQbaZVWXozuxYWPDvyOgM0/OqtoscL9X3GTCB/dhkj+bu4CvrCF4lPIOwOIXUYxa
z6ny6krl5APEYxg1oTt+fM14FSCMKTFjrapjlBbjaH0D/DXxAkEA6dd6BGC1C1zl
P8kFA8R7TuHXD3TswKJc5VhzexvZOXOhEqrjY/zXqCFsPdN6OJ8FmfksOP3BCtQd
HldqS7sYCQJBAMXWxKoYZzwE+a29FOst+1U1k6ZjNjUAa+7e5UKUf3y5PwbhL+Gv
d1VJayudIUrtNqUWiGPqdVOlxYqOnGWceb8CQQC/4nNbuEeXxWjRCJE24DoXJrcl
FdtYz2LPR9+rO9Tqkfmwqc3iNI56hsKdkTWP1N3x1Uf2lDOeQSSLy0uMTUCRAkB2
GuSE9tSKTB4RzhMy4txr3fQrHIc71OiaTY5n1ObWunAZ100SWgHPdGj6PG+nnz1E
CNObclhge1IWiVRshKFZAkEA2R9ezH/R9jBoxp+JFFK2ecEBQMSkKk7oYoE5HGmC
utnThELtrc6tOP4Ns2uv0EHGa5BzGS6hr80dBy//86+Jrg==
-----END RSA PRIVATE KEY-----`;
const privateKeyRefresh = `-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDMjp3rG0zVApcV8ohs/F+63kawlM92m7PWx0BQI3jFr3HAfi5a
j7RmsQpiHEbubRVGtOqM0xWOcg/v6lY7nOZBEIK3W+JJNcwJ4vEoCeHtIkyk9u0/
Ts5vSNUfR/RVj3EJNWspXJF+3N6Z0cCgIiEHB8g7NUfVV+TSiXt+A+5Z8QIDAQAB
AoGBAIgseNxGdENpUgL+TeufpmrUBeMPbXzb8kCMrDetJX0Uanlmhp0rBUFHok3l
3SJj48IKNgpBixwkuo9QRM+yh2SgVB9RjsFNjautmjnxXZv3ToyBB18KGaBL5qUI
FStumLpc5wdYmZK6obnRTHX+jcUi2nA096w4lXaUavyj8QABAkEA5umVCNPJDYVQ
BThnFQPYO6E+wVdJzeenazOCksiloSmySmiBqMLHeCYadKk/0edgl2cOfgxMrurA
kfZaHbux8QJBAOLIAhCxBYrKcGHUZ8q9SNxf2MBHEm9RU2SSv9n75xzkNxTf8JUg
EkXIdIyVZaWpX+2NxoCXprOfc/KtAvO1KAECQQCPCufN3hRQEeNuOHBy7jzHQ63y
azZHHVfy6qfacf1YhtHxkiev+WlDnqcI2ce1KhYF9Etf/hKK0NWWFfvhK2KhAkEA
18jGJkm6Y0iizIOGSyP2qzJMFRDLWr6AYic8g9csHpKMUsGOsua0XFATjh0tfgb+
7xPC+GLUTQABHL1BHNGYAQJARPPqUkoNAvhxHqLJMqqv/wHYExnq8d+u8/Oo6STu
vKWPmc6gN12hjk5lV+z9s4JAuSjFFr35UXQGM5rJ+FR4CQ==
-----END RSA PRIVATE KEY-----`;

const generateToken = (payload, expiresIn) => {
  return jwt.sign({ payload }, privateKey, {
    algorithm: "RS256",
    expiresIn: expiresIn,
  });
};
const generateRefreshToken = (payload, expiresIn) => {
  return jwt.sign({ payload }, privateKeyRefresh, {
    algorithm: "RS256",
    expiresIn: expiresIn,
  });
};
export { generateToken, generateRefreshToken };
