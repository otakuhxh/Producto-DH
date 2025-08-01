// src/services/authService.js
export const verifyAdminStatus = async (email) => {
  try {
    const response = await fetch(`http://localhost:8080/api/auth/verify-admin?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al verificar estado de administrador');
    }

    return await response.json();
  } catch (error) {
    console.error("Error en verifyAdminStatus:", error);
    throw error;
  }
};