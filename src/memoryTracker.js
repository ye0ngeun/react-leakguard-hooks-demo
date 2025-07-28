import { useState, useEffect, useCallback } from 'react';

// Memory tracking utility
export const memoryTracker = {
  leakyMemory: 0,
  safeMemory: 0,
  
  addLeakyMemory(size) {
    this.leakyMemory += size;
  },
  
  addSafeMemory(size) {
    this.safeMemory += size;
  },
  
  removeLeakyMemory(size) {
    this.leakyMemory = Math.max(0, this.leakyMemory - size);
  },
  
  removeSafeMemory(size) {
    this.safeMemory = Math.max(0, this.safeMemory - size);
  },
  
  getLeakyMemory() {
    return this.leakyMemory;
  },
  
  getSafeMemory() {
    return this.safeMemory;
  }
};