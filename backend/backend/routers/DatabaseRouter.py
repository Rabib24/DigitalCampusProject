class DatabaseRouter:
    """
    A router to control all database operations on models
    """
    
    route_app_labels = {'auth', 'contenttypes', 'sessions', 'admin'}
    
    def db_for_read(self, model, **hints):
        """
        Attempts to read auth and contenttypes models go to replica databases.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'replica1'
        return 'default'
    
    def db_for_write(self, model, **hints):
        """
        Attempts to write auth and contenttypes models go to default.
        """
        if model._meta.app_label in self.route_app_labels:
            return 'default'
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if models are in the same app.
        """
        db_set = {'default', 'replica1', 'replica2'}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        All non-auth models end up in this pool.
        """
        return True