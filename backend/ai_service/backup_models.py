#!/usr/bin/env python3
"""
Script to backup trained AI models for the Digital Campus project.
This script creates backups of all trained models to prevent data loss.
"""

import os
import shutil
import datetime

def backup_models():
    """
    Backup all trained AI models to a timestamped directory.
    """
    # Define paths
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    backups_dir = os.path.join(os.path.dirname(__file__), 'backups')
    
    # Create backups directory if it doesn't exist
    os.makedirs(backups_dir, exist_ok=True)
    
    # Create timestamped backup directory
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = os.path.join(backups_dir, f"models_{timestamp}")
    
    try:
        # Copy models directory to backup location
        if os.path.exists(models_dir):
            shutil.copytree(models_dir, backup_dir)
            print(f"Models backed up successfully to: {backup_dir}")
            
            # List backed up files
            for root, dirs, files in os.walk(backup_dir):
                for file in files:
                    print(f"  - {os.path.join(root, file)}")
        else:
            print(f"Models directory not found: {models_dir}")
            
    except Exception as e:
        print(f"Error during backup: {e}")
        return False
    
    return True

def list_backups():
    """
    List all available backups.
    """
    backups_dir = os.path.join(os.path.dirname(__file__), 'backups')
    
    if not os.path.exists(backups_dir):
        print("No backups directory found")
        return
    
    backups = [d for d in os.listdir(backups_dir) if os.path.isdir(os.path.join(backups_dir, d))]
    backups.sort(reverse=True)  # Sort by name (timestamp) descending
    
    if not backups:
        print("No backups found")
        return
    
    print("Available backups:")
    for backup in backups:
        backup_path = os.path.join(backups_dir, backup)
        size = sum(os.path.getsize(os.path.join(dirpath, filename)) 
                  for dirpath, dirnames, filenames in os.walk(backup_path) 
                  for filename in filenames)
        size_mb = size / (1024 * 1024)  # Convert to MB
        print(f"  - {backup} ({size_mb:.2f} MB)")

def restore_backup(backup_name):
    """
    Restore models from a specific backup.
    
    Args:
        backup_name: Name of the backup directory to restore from
    """
    backups_dir = os.path.join(os.path.dirname(__file__), 'backups')
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    backup_path = os.path.join(backups_dir, backup_name)
    
    if not os.path.exists(backup_path):
        print(f"Backup not found: {backup_path}")
        return False
    
    try:
        # Remove current models directory if it exists
        if os.path.exists(models_dir):
            shutil.rmtree(models_dir)
        
        # Copy backup to models directory
        shutil.copytree(backup_path, models_dir)
        print(f"Models restored from backup: {backup_name}")
        return True
        
    except Exception as e:
        print(f"Error during restore: {e}")
        return False

def main():
    """
    Main function to demonstrate backup functionality.
    """
    import argparse
    
    parser = argparse.ArgumentParser(description="AI Model Backup Utility")
    parser.add_argument('--backup', action='store_true', help='Create a new backup')
    parser.add_argument('--list', action='store_true', help='List all available backups')
    parser.add_argument('--restore', type=str, help='Restore from a specific backup')
    
    args = parser.parse_args()
    
    if args.backup:
        backup_models()
    elif args.list:
        list_backups()
    elif args.restore:
        restore_backup(args.restore)
    else:
        # Default action: create backup
        backup_models()

if __name__ == "__main__":
    main()