import { useState, useEffect, useCallback } from 'react';
import { pinService } from '@/services/pin.service';
import { Pin } from '@/types';
import toast from 'react-hot-toast';

export const usePins = (initialFetch = true) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPins = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pinService.getAllPins();
      setPins(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pins');
      console.error('Fetch pins error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPin = useCallback(async (data: any) => {
    try {
      const newPin = await pinService.createPin(data);
      setPins(prev => [newPin, ...prev]);
      toast.success('Pin created successfully!');
      return newPin;
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create pin');
      throw err;
    }
  }, []);

  const deletePin = useCallback(async (id: string) => {
    try {
      await pinService.deletePin(id);
      setPins(prev => prev.filter(pin => pin._id !== id));
      toast.success('Pin deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete pin');
    }
  }, []);

  const likePin = useCallback(async (id: string) => {
    try {
      await pinService.likePin(id);
      setPins(prev =>
        prev.map(pin =>
          pin._id === id
            ? { ...pin, likes: [...pin.likes, 'current-user'] }
            : pin
        )
      );
      toast.success('Pin liked!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to like pin');
    }
  }, []);

  const unlikePin = useCallback(async (id: string) => {
    try {
      await pinService.unlikePin(id);
      setPins(prev =>
        prev.map(pin =>
          pin._id === id
            ? { ...pin, likes: pin.likes.filter(like => like !== 'current-user') }
            : pin
        )
      );
      toast.success('Pin unliked');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to unlike pin');
    }
  }, []);

  const savePin = useCallback(async (id: string) => {
    try {
      await pinService.savePin(id);
      setPins(prev =>
        prev.map(pin =>
          pin._id === id
            ? { ...pin, saves: [...pin.saves, 'current-user'] }
            : pin
        )
      );
      toast.success('Pin saved!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save pin');
    }
  }, []);

  const unsavePin = useCallback(async (id: string) => {
    try {
      await pinService.unsavePin(id);
      setPins(prev =>
        prev.map(pin =>
          pin._id === id
            ? { ...pin, saves: pin.saves.filter(save => save !== 'current-user') }
            : pin
        )
      );
      toast.success('Pin unsaved');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to unsave pin');
    }
  }, []);

  useEffect(() => {
    if (initialFetch) {
      fetchPins();
    }
  }, [initialFetch, fetchPins]);

  return {
    pins,
    loading,
    error,
    fetchPins,
    createPin,
    deletePin,
    likePin,
    unlikePin,
    savePin,
    unsavePin,
  };
};