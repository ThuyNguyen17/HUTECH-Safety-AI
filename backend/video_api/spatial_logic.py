import numpy as np

class SpatialLogicProcessor:
    def __init__(self, history_size=32):
        self.history = history_size
        self.keypoints_history = []  # List of numpy arrays
        # Define dangerous zones if needed: [(x1,y1,x2,y2)] normalized
        self.danger_zones = [
            [0.0, 0.0, 1.0, 0.3], # Top 30% area (could be a bed edge or balcony)
            [0.8, 0.0, 1.0, 1.0]  # Right 20% area
        ]

    def calculate_velocity(self, current_kpts):
        """
        Calculates average velocity of keypoints compared to previous frame.
        current_kpts: shape (N, 3) where columns are [x, y, conf]
        """
        if not self.keypoints_history:
            self.keypoints_history.append(current_kpts)
            return 0.0
        
        prev_kpts = self.keypoints_history[-1]
        
        # Simple Euclidean distance change
        # Filter only confident points (> 0.5)
        mask = (current_kpts[:, 2] > 0.5) & (prev_kpts[:, 2] > 0.5)
        if np.any(mask):
            diff = current_kpts[mask, :2] - prev_kpts[mask, :2]
            velocity = np.mean(np.sqrt(np.sum(diff**2, axis=1)))
        else:
            velocity = 0.0
            
        self.keypoints_history.append(current_kpts)
        if len(self.keypoints_history) > self.history:
            self.keypoints_history.pop(0)
            
        return velocity

    def get_zone_status(self, bbox_norm):
        """
        Determines if the bbox is in a danger zone.
        bbox_norm: [cx, cy, w, h]
        Returns: 1.0 if in danger zone, 0.0 otherwise
        """
        cx, cy, w, h = bbox_norm
        # Check center point
        for zone in self.danger_zones:
            x1, y1, x2, y2 = zone
            if x1 <= cx <= x2 and y1 <= cy <= y2:
                return 1.0
        return 0.0

    def process_features(self, bbox_norm, kpts_norm):
        """
        Augments basic features with Velocity and Zone Status.
        """
        # Note: kpts_norm is flattened in main.py, let's assume it's (K, 3) here
        # Actually in main.py it's [cx,cy,w,h, x1,y1,c1, x2,y2,c2...]
        
        # Reshape keypoints for velocity calculation
        kpts_reshaped = kpts_norm.reshape(-1, 3)
        
        velocity = self.calculate_velocity(kpts_reshaped)
        zone_status = self.get_zone_status(bbox_norm)
        
        return velocity, zone_status
