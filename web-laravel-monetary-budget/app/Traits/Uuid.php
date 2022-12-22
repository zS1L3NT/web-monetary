<?php

namespace App\Traits;

use Ramsey\Uuid\Uuid as Gen;

trait Uuid {
    public static function boot() {
        parent::boot();
        static::creating(function ($model) {
            $model->id = Gen::uuid4()->toString();
        });
    }

    public function getIncrementing() {
        return false;
    }

    public function getKeyType() {
        return 'string';
    }
}
