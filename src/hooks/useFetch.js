import { useState, useCallback, useEffect } from 'react';

export default function useFetch(baseUrl) {
    const [ status, setStatus ] = useState("idle");
    const [ value, setValue ] = useState(null);
    const [ error, setError ] = useState(null);

    const fetchData = useCallback(async (signal) => {
        try {
          setStatus("fetching");
          await fetch(baseUrl, {
            signal
          })
            .then((response) => response.json())
            .then((data) => {
              setStatus("success");
              setValue(data);
            });
        } catch (e) {
          if (e.name !== "AbortError") {
            setStatus("error");
            setError(e);
          }
        }
    }, [baseUrl]);

    useEffect(() => {
        const abortController = new AbortController();
    
        fetchData(abortController.signal);
    
        return () => {
          abortController.abort();
        };
      }, 
      [baseUrl]
    );

    return { status, error, value };
}