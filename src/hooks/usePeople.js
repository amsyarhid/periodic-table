import { useCallback, useEffect, useState } from 'react';
import { fetchPeople } from '../services/sheetService';

export function usePeople() {
  const [state, setState] = useState({ people: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchPeople(controller.signal)
      .then((people) => setState({ people, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ people: [], loading: false, error: error.message });
        }
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ people: [], loading: true, error: null });
    setAttempt((current) => current + 1);
  }, []);

  return { ...state, retry };
}
