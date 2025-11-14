#!/bin/bash
set -e

# Configure PostgreSQL for replication
echo "Configuring PostgreSQL for replication..."

# Add replication settings to postgresql.conf
cat >> /var/lib/postgresql/data/postgresql.conf <<EOF
wal_level = logical
max_wal_senders = 3
max_replication_slots = 3
hot_standby = on
EOF

# Add replication user permissions to pg_hba.conf
echo "host replication ${POSTGRES_USER} 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf

echo "Replication configuration completed."