
  useEffect(() => {
    if (value.length > 0) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, setValue]);
};
