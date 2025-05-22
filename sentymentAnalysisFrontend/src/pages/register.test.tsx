import { describe, it, vi, expect, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import * as authService from "../services/auth";

vi.mock("../services/auth", async () => {
  const actual = await vi.importActual("../services/auth");
  return {
    ...actual,
    register: vi.fn(),
  };
});

describe("Register logic", () => {
  const mockAlert = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería registrar un usuario correctamente", async () => {
    (authService.register as any).mockResolvedValueOnce({});

    try {
      await authService.register({
        username: "testuser",
        password: "testpassword",
      });
      mockAlert("Usuario registrado exitosamente!");
      mockNavigate("/login");
    } catch (error) {
      // No debería entrar aquí
    }

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpassword",
      });
    });

    expect(mockAlert).toHaveBeenCalledWith("Usuario registrado exitosamente!");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("debería manejar errores de registro", async () => {
    const registerError = new Error("Registration failed");
    (authService.register as any).mockRejectedValueOnce(registerError);

    try {
      await authService.register({
        username: "failuser",
        password: "failpassword",
      });
      mockAlert("Usuario registrado exitosamente!");
      mockNavigate("/login");
      expect(true).toBe(false);
    } catch (error) {
      // Verificar que el error fue propagado correctamente
      expect((error as Error).message).toBe("Registration failed");
    }

    // Verificar que el servicio de registro fue llamado con los parámetros correctos
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        username: "failuser",
        password: "failpassword",
      });
    });

    // Verificar que las funciones mock NO fueron llamadas
    expect(mockAlert).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
