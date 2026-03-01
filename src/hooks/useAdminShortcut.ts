import { useEffect, useState } from 'react';

export const useAdminShortcut = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const keysPressed = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key.toLowerCase());

      if (
        keysPressed.has('shift') &&
        keysPressed.has('p') &&
        keysPressed.has('c')
      ) {
        e.preventDefault();
        setIsModalOpen(true);
        keysPressed.clear();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
    };

    const handleBlur = () => {
      keysPressed.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return {
    isModalOpen,
    closeModal: () => setIsModalOpen(false)
  };
};
