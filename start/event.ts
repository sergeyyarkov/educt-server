import Event from '@ioc:Adonis/Core/Event';
import Database from '@ioc:Adonis/Lucid/Database';
import Application from '@ioc:Adonis/Core/Application';

/**
 * Debug sql queries
 */
Event.on('db:query', query => {
  if (Application.inDev) {
    Database.prettyPrint(query);
  }
});
